# Test Employee Persistence
Write-Host "Testing Employee Persistence" -ForegroundColor Green

# Get initial employee count
$initial = Invoke-RestMethod -Uri "http://localhost:5000/api/employees" -Method GET
Write-Host "Initial employees: $($initial.Length)" -ForegroundColor Yellow

# Create a new employee
$newEmployee = @{
    firstName = "Test"
    lastName = "Employee"
    email = "test@company.com"
    phone = "123-456-7890"
    role = "Developer"
    salaryPKR = 100000
    username = "test.employee"
    userRole = "employee"
    status = "Active"
} | ConvertTo-Json

Write-Host "Creating new employee..." -ForegroundColor Yellow
$created = Invoke-RestMethod -Uri "http://localhost:5000/api/employees" -Method POST -Body $newEmployee -ContentType "application/json"
Write-Host "Response: $($created.msg)" -ForegroundColor Green

# Get updated employee count
$updated = Invoke-RestMethod -Uri "http://localhost:5000/api/employees" -Method GET
Write-Host "Updated employees: $($updated.Length)" -ForegroundColor Yellow

if ($updated.Length -gt $initial.Length) {
    Write-Host "SUCCESS: Employee was persisted!" -ForegroundColor Green
    Write-Host "New employee: $($updated[-1].firstName) $($updated[-1].lastName)" -ForegroundColor Green
} else {
    Write-Host "FAILED: Employee was not persisted!" -ForegroundColor Red
}

# Show all employees
Write-Host "`nAll employees:" -ForegroundColor Yellow
$updated | ForEach-Object {
    Write-Host "- $($_.firstName) $($_.lastName) ($($_.email))" -ForegroundColor White
}