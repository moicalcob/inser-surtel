pipeline {
    agent {
        node {
        label 'raspi'
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