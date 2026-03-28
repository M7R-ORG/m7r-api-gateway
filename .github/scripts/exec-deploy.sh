set -euo pipefail

# connect to ssh
mkdir -p ~/.ssh/
echo "${SSH_PRIVATE_KEY}" >>~/.ssh/ssh-key.pem

chmod 600 ~/.ssh/ssh-key.pem

ssh-keyscan -H ${SSH_HOST} >>~/.ssh/known_hosts

CONNECTION_STR="${SSH_USER}@${SSH_HOST}"

ssh -i ~/.ssh/ssh-key.pem $CONNECTION_STR <<EOF
  mkdir -p ${PATH_TO_COMPOSE_FILE}
EOF

scp -i ~/.ssh/ssh-key.pem docker-compose.yaml "${CONNECTION_STR}:${PATH_TO_COMPOSE_FILE}"

ssh -i ~/.ssh/ssh-key.pem $CONNECTION_STR <<EOF
  cd ${PATH_TO_COMPOSE_FILE}
  docker-compose down
  docker-compose pull
  docker-compose up -d
  docker system prune -f || true
EOF
