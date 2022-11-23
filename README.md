# Quiz App

Real time quiz app to test students' knowledge in school / anywhere else.
The main focus is on testing programming knowledge. Currently user can create questions in several programming languages - Java, C, C++ and Python. <br>

##

After creating the quiz, teacher (signed in user) can start it and give others the pin code to join. Then the user (teacher) screen shares the quiz and at each question students answer on their own devices. After each question, detailed evaluation is displayed at the teacher's screen and further discussion can be held between students and the teacher.

##

Frontend of the app is written in React and TypeScript (Some JS files still remain, rewriting them to TypeScript is in progress), backend in Spring. <br> Whole app is deployed with Heroku on address https://murmuring-springs-61212.herokuapp.com/.

# Local app running - Docker, K8s and Helm
In order to practice my Docker, K8s and Helm skills I gained at work, I wrote K8s and Docker manifests and Helm charts to enable the app to be run locally without any hustle.

## Option 1 - Docker compose
 - Prerequisites: Docker is installed on the computer and docker desktop or other docker runtime is running
 1. In root folder of the app, write `docker compose up`. Necessary images will be created from dockerfiles. 
 2. After building is done, navigate to `localhost:3000` in your browser and app should be available there. 
 
 ## Option 2 - Helm
  - Prerequisites: kubectl and helm installed on the computer, docker environment is running locally. The necessary files are located in the `charts` folder
  1. Navigate to charts folder: `cd charts`
  2. Run `helm install postgres db`
  3. Run `helm install backend api`
  4. Run `helm install frontend ui`
  5. Navigate to `localhost:30000` in your browser - the app should be available there.
