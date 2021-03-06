import Ember from 'ember';

export default Ember.Controller.extend({
  isShowingModal: false,
  errorMessage: '',
  session: Ember.inject.service('session'),
  actions: {
    startMainBuild() {
      const main = this.get('model.jobs').objectAt(0);
      const builds = main.get('builds');

      if (builds.length > 0) {
        const lastBuild = builds.objectAt(0);
        const status = lastBuild.get('status');

        // build is already running, just go to the build
        if (status === 'QUEUED' || status === 'RUNNING') {
          return this.transitionToRoute('pipeline.builds.build', lastBuild.get('id'));
        }
      }

      this.set('isShowingModal', true);

      const newBuild = this.store.createRecord('build', { jobId: main.get('id') });

      return newBuild.save().then((b) => {
        this.set('isShowingModal', false);

        return this.transitionToRoute('pipeline.builds.build', b.get('id'));
      }).catch((e) => {
        this.set('isShowingModal', false);
        this.set('errorMessage', e.message);
      });
    }
  }
});
