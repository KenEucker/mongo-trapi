start /k 
if not exist "%cd%\data\" (
echo. Data folder doesn't exist, creating...
md %cd%\data\
)
mongodb\bin\mongod.exe --dbpath "%cd%\data"
