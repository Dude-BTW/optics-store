#!/bin/bash

export VAULT_ADDR='http://127.0.0.1:8200'
vault login root > /dev/null

for file in ~/.config/vault/secrets/*.json; do
    if [ -f "$file" ]; then
        project_name=$(basename "$file" .json)
        vault kv put "secret/$project_name" @"$file"
        echo "Secrets imported: secret/$project_name"
    fi
done
