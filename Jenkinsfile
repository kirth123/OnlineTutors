// This is a Jenkinsfile. It is a script that Jenkins will run when a build is triggered.
pipeline {
    // Run pipeline on any available agent
    agent any

    environment {
        REACT_APP_CLIENT = credentials('REACT_APP_CLIENT') 
        REACT_APP_SERVER = credentials('REACT_APP_SERVER') 
        CLIENT = credentials('CLIENT') 
        SERVER = credentials('SERVER') 
        MONGO_URL = credentials('MONGO_URL') 
        SECRET_KEY = credentials('SECRET_KEY')
        APP_PASSWORD = credentials('APP_PASSWORD')
        EMAIL_ACCT = credentials('EMAIL_ACCT')
        PORT = credentials('PORT')
    }

    stages {
        // Checkout source code from source control management system
        stage('Checkout') {
            steps {
                sh echo '$MONGO_URL'
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
                sh 'docker compose up -d'
            }
        }
    }
}