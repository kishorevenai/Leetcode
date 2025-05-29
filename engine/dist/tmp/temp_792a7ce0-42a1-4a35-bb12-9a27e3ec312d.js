
function twoSum(nums, target) {
  const map = {}; // To store the value and its index

  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];

    // Check if complement already exists in the map
    if (map.hasOwnProperty(complement)) {
      return [map[complement], i];
    }

    // Store the current number with its index
    map[nums[i]] = i;
  }

  // If no solution found (though the problem guarantees one)
  return [];

}


    (() => {
      try {
        const result = twoSum([2,7,11,15],9);
        const expected = [0,1];
        const passed = JSON.stringify(result) === JSON.stringify(expected);
        console.log(JSON.stringify({ test: 1, passed }));
      } catch (err) {
        console.log(JSON.stringify({ test: 1, passed: false, error: err.message }));
      }
    })();
  

    (() => {
      try {
        const result = twoSum([3,2,4],6);
        const expected = [1,2];
        const passed = JSON.stringify(result) === JSON.stringify(expected);
        console.log(JSON.stringify({ test: 2, passed }));
      } catch (err) {
        console.log(JSON.stringify({ test: 2, passed: false, error: err.message }));
      }
    })();
  

    (() => {
      try {
        const result = twoSum([3,3],6);
        const expected = [0,1];
        const passed = JSON.stringify(result) === JSON.stringify(expected);
        console.log(JSON.stringify({ test: 3, passed }));
      } catch (err) {
        console.log(JSON.stringify({ test: 3, passed: false, error: err.message }));
      }
    })();
  
  