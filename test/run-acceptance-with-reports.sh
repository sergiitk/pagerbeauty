#!/bin/sh

set -o pipefail

yarn -s run test:acceptance --tap | tee ./tmp/tap-ava.txt
test_exit_code=$?

yarn -s run tap-xunit < ./tmp/tap-ava.txt > ./tmp/tap-xunit.xml

exit $test_exit_code
