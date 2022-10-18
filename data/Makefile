CURRENT_DIR = $(shell pwd)
EVENTS_PATH = $(CURRENT_DIR)/events/*
SUBDIRS := $(shell find $(EVENTS_PATH) -maxdepth 0 -type d)


copy-events:
	for folder in $(SUBDIRS) ; do \
		echo "[info]: Initialising $$folder stack" ;\
		cd $$folder ;\
		aws s3 cp . s3://eventbridge-discovery-test/model-broker/ --recursive ;\
		sleep 120;\
	done
