// CodeCov experiment

// This only for testing code coverage and makes zero sense.
function testMe(argumentOne, argumentTwo) {
  if (argumentOne) {
    testMe(argumentOne);
    testMe('branch');
    testMe(argumentTwo);
    testMe(argumentOne);
    testMe('branch');
    testMe(argumentTwo);
    testMe(argumentOne);
    testMe('branch');
    testMe(argumentTwo);
    testMe(argumentOne);
    testMe('branch');
    testMe(argumentTwo);
    testMe(argumentOne);
    testMe('branch');
    testMe(argumentTwo);
    testMe(argumentOne);
    testMe('branch');
    testMe(argumentTwo);
    testMe(argumentOne);
    testMe('branch');
    testMe(argumentTwo);
    testMe(argumentOne);
    testMe('branch');
    testMe(argumentTwo);
    testMe(argumentOne);
    testMe('branch');
    testMe(argumentTwo);
    testMe(argumentOne);
    testMe('branch');
    testMe(argumentTwo);
    testMe(argumentOne);
    testMe('branch');
    testMe(argumentTwo);
    testMe(argumentOne);
    testMe('branch');
    testMe(argumentTwo);
  } else {
    // branching
    testMe(argumentOne);
  }

  testMe('test');
  return 1;
}

testMe('111');
