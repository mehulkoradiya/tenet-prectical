# JMeter Wallet API Load Test

This JMeter test plan is designed to test the wallet update API with a specific load pattern: **100 calls per minute** with **70 increase balance requests** and **30 decrease balance requests**.

## 📋 Test Configuration

### Test Plan Details
- **Total Requests**: 100 per minute
- **Increase Balance Requests**: 70 (70% of total)
- **Decrease Balance Requests**: 30 (30% of total)
- **Test Duration**: 60 seconds
- **Target User ID**: 1 (configurable)

### Request Details
- **Increase Balance**: `GET /api/wallet/update?userId=1&balance=10`
- **Decrease Balance**: `GET /api/wallet/update?userId=1&balance=-5`
- **Expected Response**: HTTP 200 OK

## 🚀 Prerequisites

1. **Apache JMeter** installed and in PATH
   - Download from: https://jmeter.apache.org/download_jmeter.cgi
   - Extract and add `bin` folder to PATH

2. **Node.js Application Running**
   - Start your wallet API server: `npm start`
   - Ensure it's running on `http://localhost:3000`

3. **MongoDB Running**
   - Ensure MongoDB is running and accessible
   - Database should have seeded wallet data

## 📁 Files

- `wallet-api-test-plan.jmx` - JMeter test plan
- `run-jmeter-test.bat` - Windows batch script to run the test
- `JMETER_TEST_README.md` - This documentation

## 🎯 Running the Test

### Method 1: Using Batch Script (Windows)
```bash
run-jmeter-test.bat
```

### Method 2: Command Line
```bash
jmeter -n -t wallet-api-test-plan.jmx -l results.jtl -e -o report
```

### Method 3: JMeter GUI
1. Open JMeter GUI
2. Load `wallet-api-test-plan.jmx`
3. Click the green "Start" button

## 📊 Expected Results

### Load Distribution
- **70 requests** will increase balance by +10 each
- **30 requests** will decrease balance by -5 each
- **Net balance change**: (70 × 10) - (30 × 5) = 700 - 150 = +550

### Performance Metrics
- **Throughput**: ~100 requests/minute
- **Response Time**: Should be under 1000ms for most requests
- **Error Rate**: Should be 0% for successful tests

## 🔧 Customization

### Changing Test Parameters
1. **User ID**: Modify the `userId` variable in the test plan
2. **Balance Amounts**: Change the `balance` parameter values
3. **Request Count**: Adjust the loop count in each thread group
4. **Test Duration**: Modify the `duration` property

### Example Modifications
```xml
<!-- Change user ID -->
<stringProp name="Argument.value">2</stringProp>

<!-- Change balance amounts -->
<stringProp name="Argument.value">20</stringProp>  <!-- Increase -->
<stringProp name="Argument.value">-10</stringProp> <!-- Decrease -->

<!-- Change request counts -->
<stringProp name="LoopController.loops">50</stringProp>  <!-- Increase group -->
<stringProp name="LoopController.loops">20</stringProp>  <!-- Decrease group -->
```

## 📈 Monitoring

### Real-time Monitoring
- Use JMeter's "View Results Tree" listener for detailed request/response
- Use "Aggregate Report" for performance statistics

### Results Analysis
- **results.jtl**: Raw test results (CSV format)
- **report/**: HTML report with charts and statistics

## 🐛 Troubleshooting

### Common Issues
1. **Connection Refused**: Ensure your Node.js server is running
2. **404 Errors**: Check if the API endpoint path is correct
3. **Validation Errors**: Ensure the target user ID exists in the database
4. **Timeout Errors**: Check MongoDB connection and performance

### Debug Steps
1. Test API manually first: `curl "http://localhost:3000/api/wallet/update?userId=1&balance=10"`
2. Check server logs for errors
3. Verify MongoDB connection
4. Check JMeter logs for detailed error messages

## 📝 Test Scenarios

### Scenario 1: Normal Load
- 100 requests/minute (70 increase, 30 decrease)
- Expected: All requests succeed, balance increases by 550

### Scenario 2: High Load
- Increase loop counts to 200+ requests/minute
- Expected: May see some timeouts or errors

### Scenario 3: Negative Balance Test
- Increase decrease requests to cause negative balance
- Expected: API should return 400 error for negative balance

## 🔍 Validation

After running the test, verify:
1. **Database State**: Check final balance in MongoDB
2. **API Logs**: Review server logs for any errors
3. **Response Codes**: All requests should return 200 (except intentional negative balance tests)
4. **Performance**: Response times should be consistent

## 📊 Sample Expected Output

```
Starting JMeter Wallet API Load Test...
Running test plan: wallet-api-test-plan.jmx
Test will run for 60 seconds with 100 total requests (70 increase, 30 decrease)

Creating summariser <summary>
Created the tree successfully using wallet-api-test-plan.jmx
Starting standalone test @ 2024-01-15 10:30:00 UTC
Waiting for possible shutdown message on port 4445
summary +      1 in     0.5s =    2.0/s Avg:   245 Min:   245 Max:   245 Err:     0 (0.00%)
summary +     99 in    59.5s =    1.7/s Avg:   156 Min:    45 Max:   389 Err:     0 (0.00%)
summary =    100 in    60.0s =    1.7/s Avg:   157 Min:    45 Max:   389 Err:     0 (0.00%)
Tidying up ...
@ 2024-01-15 10:31:00 UTC
... end of run

Test completed!
Results saved to: results.jtl
HTML report generated in: report/
``` 