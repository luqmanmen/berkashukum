@echo off
echo ==============================================================
echo  TOLONG TEKAN "YES" ATAU "OK" JIKA ADA PERINGATAN ADMINISTRATOR
echo ==============================================================
echo Sedang melakukan proses build dan deploy ke Cloudflare...
call npm run deploy > deploy_output.log 2>&1
echo Selesai!
