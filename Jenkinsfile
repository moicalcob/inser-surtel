pipeline {
    agent {
        node {
            label 'master'
            customWorkspace '/home/ubuntu/docker/jenkins/ingres'
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
                sh 'docker rm ingres_front_1'
                sh 'docker run --name ingres_front_1 -d -p 80:80 ingres-front'
            }
        }
    }
    post {
        cleanup {
            /* clean up our workspace */
            deleteDir()
            /* clean up tmp directory */
            dir("${workspace}@tmp") {
                deleteDir()
            }
            /* clean up script directory */
            dir("${workspace}@script") {
                deleteDir()
            }
        }
    }
}