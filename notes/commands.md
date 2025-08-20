# Run Frontend Apps (Platform + Admin)

`nx run eDB:serve --devRemotes=mfe-edb-admin`

# Check Laravel Logs locally

`cd apps/webshop-api`  
`tail -f storage/logs/laravel.log`

# Run Migrations

`php artisan migrate`

export KUBECONFIG=$(pwd)/secret/k3s-config.yaml
export KUBECONFIG=$(pwd)/secret/k3s-prod-config.yaml

# Applying new config to cluster

`kubectl apply -f k8s/prod/admin-api/admin-api-deployment.prod.yaml`

`nx g @nx/angular:library --name=client-checkout --directory=libs/eDB-webshop/data-access/client-checkout`
nx g @nx/angular:library --name=feature-aimode --directory=libs/eDB-webshop/features/feature-aimode

php artisan make:seeder YourSeederName

# move a project (lib or app)

➜ webshop-api git:(sprint-2) ✗ nx g @nx/workspace:move --project platform-api --destination apps/server/platform-api
