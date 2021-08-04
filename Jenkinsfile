pipeline {
    agent any 
    stages {
        stage('Build') { 
            steps {
                sh 'cd /home/ubuntu/docker && ls'
                sh 'git clone git@github.com:moicalcob/ingres-surtel.git'
                sh 'cd ingres-surtel'
                sh 'ls'
            }
        }
    }
}