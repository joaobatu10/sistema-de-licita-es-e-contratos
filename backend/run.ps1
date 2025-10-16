$env:PYTHONPATH = "$PSScriptRoot"
uvicorn app.main:app --reload
