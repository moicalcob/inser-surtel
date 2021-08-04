pipeline {
    agent {
        node {
        customWorkspace '/home/ubuntu/docker'
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