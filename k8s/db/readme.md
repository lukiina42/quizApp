To spin up db through k8s, all of these config files need to be applied in following order:
 - configmap
 - pv
 - pvc
 - deploy
 - service

After that, you should be able to connect to the database from cmd using:

`kubectl exec -it quizapp-k8s-postgres-xxxx -- psql -h localhost -U blabla --password -p 5432 quizdb`

Replace the xxxx with the pod name (`kubectl get pods`), enter and type password 2412.