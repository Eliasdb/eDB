# Run Frontend Apps (Platform + Admin)

`nx run eDB:serve --devRemotes=eDB-admin`

# Check Laravel Logs locally

`cd apps/webshop-api`  
`tail -f storage/logs/laravel.log`

# Run Migrations

`php artisan migrate`

export KUBECONFIG=$(pwd)/secret/k3s-config.yaml
