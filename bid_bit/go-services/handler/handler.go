package handler

import (
	"encoding/json"
	"net/http"
	"strings"

	"github.com/pkg/errors"
	"github.com/rs/zerolog/log"
	"github.com/runabol/tork"
	"github.com/runabol/tork/engine"
	"github.com/runabol/tork/input"
)

type ExecRequest struct {
	Code     string `json:"code"`
	Language string `json:"language"`
}

func Handler(w http.ResponseWriter, r *http.Request) {
	er := ExecRequest{}

	decoder := json.NewDecoder(r.Body)
	if err := decoder.Decode(&er); err != nil {
		http.Error(w, errors.Wrapf(err, "error binding request").Error(), http.StatusBadRequest)
		return
	}

	log.Debug().Msgf("%s", er.Code)

	task, err := buildTask(er)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	result := make(chan string)

	listener := func(j *tork.Job) {
		if j.State == tork.JobStateCompleted {
			result <- j.Execution[0].Result
		} else {
			result <- j.Execution[0].Error
		}
	}

	input := &input.Job{
		Name:  "code execution",
		Tasks: []input.Task{task},
	}

	job, err := engine.SubmitJob(r.Context(), input, listener)

	if err != nil {
		http.Error(w, errors.Wrapf(err, "error executing code").Error(), http.StatusBadRequest)
		return
	}

	log.Debug().Msgf("job %s submitted", job.ID)

	select {
	case r := <-result:
		json.NewEncoder(w).Encode(map[string]string{"output": r})
	case <-r.Context().Done():
		json.NewEncoder(w).Encode(map[string]string{"message": "timeout"})
	}
}

func buildTask(er ExecRequest) (input.Task, error) {
	var image string
	var run string
	var filename string

	switch strings.TrimSpace(er.Language) {
	case "":
		return input.Task{}, errors.Errorf("require: language")
	case "python":
		image = "python:3"
		filename = "script.py"
		run = "python script.py > $TORK_OUTPUT"
	case "go":
		image = "golang:1.19"
		filename = "main.go"
		run = "go run main.go > $TORK_OUTPUT"
	case "bash":
		image = "alpine:3.18.3"
		filename = "script"
		run = "sh ./script > $TORK_OUTPUT"
	case "javascript":
		image = "node:14-alpine"
		filename = "script.js"
		run = "node script.js > $TORK_OUTPUT"

	default:
		return input.Task{}, errors.Errorf("unknown language: %s", er.Language)
	}

	return input.Task{
		Name:    "execute code",
		Image:   image,
		Run:     run,
		Timeout: "400s",
		Limits: &input.Limits{
			CPUs:   "1",
			Memory: "60m",
		},
		Files: map[string]string{
			filename: er.Code,
		},
	}, nil
}