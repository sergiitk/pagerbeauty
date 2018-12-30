#!/bin/sh

set -o pipefail

yarn -s run test:acceptance --tap > ./tmp/tap-ava.txt
test_exit_code=$?

# Human-readable diff
# FORCE_COLOR=t yarn -s run tap-diff < ./tmp/tap-ava.txt
FORCE_COLOR=t yarn -s run tap-spec < ./tmp/tap-ava.txt

# Machine-readable xUnit report
yarn -s run tap-xunit < ./tmp/tap-ava.txt > ./tmp/tap-xunit.xml

exit $test_exit_code
