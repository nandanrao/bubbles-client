#!/bin/sh

REACT_APP_NF_HOST="http://209.177.92.240" npm run build
aws --profile bgse s3 sync ./build/ s3://
