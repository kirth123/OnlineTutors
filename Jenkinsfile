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
                    sh 'npm test --verbose'
                }
            }
        }
        
        // This stage is telling Jenkins to build Docker images and run containers
        stage('Docker Compose') {
            steps {
                sh 'docker compose down'
                sh 'docker compose up -d'
            }
        }
    }
}