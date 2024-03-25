# PowerShell Script to Add a Directory to the PATH Environment Variable

param(
    [string]$directoryToAdd,
    [string]$scopeChoice
)

# Validate the directory
if (-not (Test-Path $directoryToAdd)) {
    Write-Error "The specified directory does not exist."
    exit
}

# Function to add directory to PATH
function Add-DirectoryToPath([string]$dir, [string]$scope) {
    $envPath = [Environment]::GetEnvironmentVariable("Path", $scope)
    $paths = $envPath -split ";"
    
    if ($paths -notcontains $dir) {
        $newPath = "$envPath;$dir"
        [Environment]::SetEnvironmentVariable("Path", $newPath, $scope)
        Write-Host "Directory '$dir' added to $scope PATH."
    }
    else {
        Write-Host "Directory '$dir' is already in the $scope PATH."
    }
}

# Use the arguments directly
if ($scopeChoice -eq "U") {
    Add-DirectoryToPath $directoryToAdd "User"
}
elseif ($scopeChoice -eq "S") {
    Add-DirectoryToPath $directoryToAdd "Machine"
}
else {
    Write-Error "Invalid scope choice. Please specify 'U' for User PATH or 'S' for System PATH."
}
