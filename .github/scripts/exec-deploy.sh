set -euo pipefail

# connect to ssh
mkdir -p ~/.ssh/
echo "${SSH_PRIVATE_KEY}" >>~/.ssh/ssh-key.pem

chmod 600 ~/.ssh/ssh-key.pem

ssh-keyscan -H ${SSH_HOST} >>~/.ssh/known_hosts

CONNECTION_STR="${SSH_USER}@${SSH_HOST}"
TARGET_DIR="${PROJECT_PATH%/}/${GITHUB_REPO_NAME}"

ssh -i ~/.ssh/ssh-key.pem $CONNECTION_STR <<EOF
  mkdir -p ${TARGET_DIR}
EOF

scp -i ~/.ssh/ssh-key.pem docker-compose.yaml "${CONNECTION_STR}:${TARGET_DIR}"

ssh -i ~/.ssh/ssh-key.pem $CONNECTION_STR <<EOF
  cd ${TARGET_DIR}
  docker-compose down
  docker-compose pull
  docker-compose up -d
  docker system prune -f || true
EOF
