pipeline {
    agent {
        node {
            label 'master'
            customWorkspace '/home/ubuntu/docker/ingres'
        }
    }    
    stages {
        stage('Build') { 
            steps {
                sh 'cd ingres-surtel'
                sh 'ls'
            }
        }
    }
}