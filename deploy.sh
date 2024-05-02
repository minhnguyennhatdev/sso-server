echo "Feching origin..."

git fetch --all && git reset --hard @{u}

echo "Deploying..."

yarn

pm2 restart ecosystem.config.js

# SERVICE='todo-server'
# PORT=8000

# docker stop $SERVICE
# docker rm $SERVICE
# docker build --tag $SERVICE .
# docker run --name $SERVICE -d -p $PORT:$PORT $SERVICE

echo "Done."