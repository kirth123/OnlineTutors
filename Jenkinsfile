// This is a Jenkinsfile. It is a script that Jenkins will run when a build is triggered.
pipeline {
    // Run pipeline on any available agent
    agent any

    stages {
        // Checkout source code from source control management system
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        // Run unit tests for React client
        stage('Client Tests') {
            steps {
                dir('client') {
                    sh 'npm ci'
                    sh 'npm ci --save-dev'
                    sh 'npm test'
                    sh 'rm -rf node_modules'
                }
            }
        }
        
        // Remove old docker containers and kill processes running at web server ports
        stage('Remove Old Docker Containers') {
            steps {
                sh 'docker compose down'
                sh 'docker system prune -a'
                sh 'sudo lsof -i :80 -t | xargs -r sudo kill -9'
                sh 'sudo lsof -i :443 -t | xargs -r sudo kill -9'
                sh 'sudo lsof -i :8080 -t | xargs -r sudo kill -9'
            }
        }

        // Write env files, build Docker images, and run containers
        stage('Docker Compose') {
            steps {
                sh '''
                        echo "REACT_APP_CLIENT=$REACT_APP_CLIENT" > client/.env
                        echo "REACT_APP_SERVER=$REACT_APP_SERVER" >> client/.env
                        echo "CLIENT=$CLIENT" > server/.env
                        echo "SERVER=$SERVER" >> server/.env
                        echo "MONGO_URL=$MONGO_URL" >> server/.env
                        echo "SECRET_KEY=$SECRET_KEY" >> server/.env
                        echo "EMAIL_ACCT=$EMAIL_ACCT" >> server/.env
                        echo "APP_PASSWORD=$APP_PASSWORD" >> server/.env
                        echo "PORT=$PORT" >> server/.env
                    '''

                sh 'docker compose up -d'
            }
        }
    }
}