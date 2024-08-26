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
        
        // Execute tests in client directory
        stage('Client Tests') {
            steps {
                dir('client') {
                    sh 'npm ci'
                    sh 'npm ci --save-dev'
                    sh 'npm test'
                }
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

                sh 'docker compose down'
                sh 'sudo lsof -i :80 -t | xargs sudo kill -9'
                sh 'sudo lsof -i :443 -t | xargs sudo kill -9'
                sh 'sudo lsof -i :8080 -t | xargs sudo kill -9'
                sh 'docker compose up -d'
            }
        }
    }
}