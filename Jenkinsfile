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
                sh 'docker build . -t ingres-front'
            }
        }
        stage('Run') {
            steps {
                sh 'docker run --name ingres_front_1 -d -p 80:80 ingres-front'
            }
        }
    }
    post {
        always {
            cleanWs()
        }
    }
}