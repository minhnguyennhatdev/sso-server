def remote = [:]
remote.name = 'ubuntu'
remote.allowAnyHosts = true

node {
  withCredentials([
    sshUserPrivateKey(
      credentialsId: 'OVH_CREDENTIALS',
      keyFileVariable: 'identity',
      passphraseVariable: '',
      usernameVariable: 'userName'
    ),
    string(credentialsId: 'OVH_HOST', variable: 'ovhHost')
  ]) {
    remote.host = ovhHost
    remote.user = userName
    remote.identityFile = identity

    stage('DEPLOY') {
      sshCommand remote: remote, command: 'cd /var/www/myhr/sso-server && ./deploy.sh'
    }
  }
}
