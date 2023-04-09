#!/bin/bash

echo "Starting replica set initialize"

until mongosh --host mongo1:27017 --eval "print(\"waited for connection\")"
do
    sleep 7
done
echo "Connection finished"
echo "Creating replica set"
mongosh --host mongo1 <<EOF
config = {
    "_id": "chat-cluster-set",
    "version": 1,
    "members": [
        {
            "_id": 1,
            "host": "mongo1:27017",
            "priority": 3
        },
        {
            "_id": 2,
            "host": "mongo2:27017",
            "priority": 2
        },
        {
            "_id": 3,
            "host": "mongo3:27017",
            "priority": 1
        }
    ]
};
rs.initiate(config, { force: true });
rs.status();
EOF

echo "Replica set created"