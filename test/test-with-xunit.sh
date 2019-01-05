#!/bin/sh

# Note: pipefail is not suppored in dash, which is used for /bin/sh
# in some distributions (f.e. Ubuntu). In this cases, just run script
# with bash:
# bash ./test/test-with-xunit.sh
set -o pipefail

case "$1" in
  'acceptance' | 'integration' | 'unit')
    TEST_SCRIPT="test:$1 --tap"
    TEST_TYPE=$1
    ;;
  'unit:coverage')
    # Same tests, different mode
    TEST_SCRIPT="test:$1 --tap"
    TEST_TYPE='unit'
    ;;
  *)
    echo "Usage: $0 {acceptance|integration|unit|unit:coverage}"
    exit 1
    ;;
esac

TAP_OUTPUT_FILE="./tmp/tap-$TEST_TYPE.txt"
XUNIT_OUTPUT_FILE="./tmp/xunit-$TEST_TYPE.xml"

# Run ava in TAP format and output to correspinding file.
echo "Running $TEST_TYPE tests, tap output to $TAP_OUTPUT_FILE"
yarn run $TEST_SCRIPT > $TAP_OUTPUT_FILE
test_exit_code=$?

# Human-readable diff
echo "Test results:"
FORCE_COLOR=t yarn -s run tap-spec < $TAP_OUTPUT_FILE

# Machine-readable xUnit report
echo "Saving xUnit report to to $XUNIT_OUTPUT_FILE"
yarn -s run tap-xunit < $TAP_OUTPUT_FILE > $XUNIT_OUTPUT_FILE

exit $test_exit_code
