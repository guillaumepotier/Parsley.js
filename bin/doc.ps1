
$1 = $Args[0]

if($1 -ne $null) {
    yuidoc -n -o doc/api --project-version $1 --quiet .
}
else {
    yuidoc -n -o doc/api .
}
