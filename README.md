#Replication
sudo mongod --dbpath /var/lib/mongodb/first --port 27001 --replSet My_Replica_Set --fork --logpath /var/log/mongodb/my_database_1.log
sudo mongod --dbpath /var/lib/mongodb/second --port 27002 --replSet My_Replica_Set --fork --logpath /var/log/mongodb/my_database_2.log
sudo mongod --dbpath /var/lib/mongodb/third --port 27003 --replSet My_Replica_Set --fork --logpath /var/log/mongodb/my_database_3.log

sudo netstat -lntpu | grep mongod
sudo mongodump --host 127.0.0.1 --port 27001 -o /home/klisan/backups/my_db/
sudo mongorestore --drop --port 27001 /home/klisan/backups/my_db/

#Sharding (does not working)
## Shard our replicasets
sudo mongod --replSet "My_Replica_Set" --shardsvr --port 27001 --bind_ip localhost
sudo mongod --replSet "My_Replica_Set" --shardsvr --port 27002 --bind_ip localhost
sudo mongod --replSet "My_Replica_Set" --shardsvr --port 27003 --bind_ip localhost
## Config
sudo mongod --configsvr --replSet configReplSet --bind_ip localhost
rs.initiate( {
   _id: "configReplSet",
   configsvr: true,
   members: [
      { _id: 0, host: "localhost:27001" },
      { _id: 1, host: "localhost:27002" },
      { _id: 2, host: "localhost:27003" }
   ]
} )

## Start mongos
sudo mongos --configdb configReplSet/localhost:27001,localhost:27002,localhost:27003  --bind_ip localhost

## Connect mongo to the mongos (for each set)
sudo mongo localhost:27001
sh.addShard( "My_Replica_Set/localhost:27001,localhost:27002,localhost:27003" )

## enable sharding
Doest'n working =(