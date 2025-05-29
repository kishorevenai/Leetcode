
// Write your code here


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
  
  