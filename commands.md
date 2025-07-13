# Run Frontend Apps (Platform + Admin)

`nx run eDB:serve --devRemotes=eDB-admin`

# Check Laravel Logs locally

`cd apps/webshop-api`  
`tail -f storage/logs/laravel.log`

# Run Migrations

`php artisan migrate`

export KUBECONFIG=$(pwd)/secret/k3s-config.yaml

# Applying new config to cluster

`kubectl apply -f k8s/prod/admin-api/admin-api-deployment.prod.yaml`
