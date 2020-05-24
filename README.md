sudo mongod --dbpath /var/lib/mongodb/first --port 27001 --replSet My_Replica_Set --fork --logpath /var/log/mongodb/my_database_1.log
sudo mongod --dbpath /var/lib/mongodb/second --port 27002 --replSet My_Replica_Set --fork --logpath /var/log/mongodb/my_database_2.log
sudo mongod --dbpath /var/lib/mongodb/third --port 27003 --replSet My_Replica_Set --fork --logpath /var/log/mongodb/my_database_3.log
sudo netstat -lntpu | grep mongod
sudo mongodump --host 127.0.0.1 --port 27001 -o /home/klisan/backups/my_db/
sudo mongorestore --drop --port 27001 /home/klisan/backups/my_db/