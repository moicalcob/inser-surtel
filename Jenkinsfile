pipeline {
    agent {
        node {
            label 'master'
            // customWorkspace '/home/ubuntu/docker/ingres'
        }
    }    
    stages {
        stage('TEST'){
            steps {
                sh 'whoami'
            }
        }
        // stage('Build') { 
        //     steps {
        //         sh 'docker build . -t ingres-front'
        //     }
        // }
        // stage('Run') {
        //     steps {
        //         sh 'docker rm ingres_front_1'
        //         sh 'docker run --name ingres_front_1 -d -p 80:80 ingres-front'
        //         sh 'cd /home/ubuntu/docker && rm ${workspace}@tmp'
        //     }
        // }
    }
    post {
        always {
            cleanWs()
        }
    }
}