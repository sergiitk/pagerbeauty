#!/bin/sh

set -o pipefail

case "$1" in
  'acceptance' | 'unit' | 'integration')
    TEST_TYPE=$1
    ;;
  *)
    echo "Usage: $0 {acceptance|unit|integration}"
    exit 1
    ;;
esac

# Run ava in TAP format and output to correspinding file.
yarn -s run test:$TEST_TYPE --tap > ./tmp/tap-ava-$TEST_TYPE.txt
test_exit_code=$?

# Human-readable diff
FORCE_COLOR=t yarn -s run tap-spec < ./tmp/tap-ava-$TEST_TYPE.txt

# Machine-readable xUnit report
yarn -s run tap-xunit < ./tmp/tap-ava-$TEST_TYPE.txt > ./tmp/tap-xunit-$TEST_TYPE.xml

exit $test_exit_code
