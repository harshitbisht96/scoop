Router.route('/', {
    template:'home',
    name:'home'
});
Router.route('/teamSelection',{
    template:'teamSelection',
    name:'teamSelection'
});

Router.route('/posts', {
    template:'posts',
    name:'posts',
    onBeforeAction:function(){
        var currentUser=Meteor.userId();
        if (currentUser){
            this.next();
        }
        else{
            this.render('login');
        }
    }
});



Router.configure({
    layoutTemplate: 'main',
    loadingTemplate: 'loading',
  notFoundTemplate: 'notFound',
 
});


Router.route('/login',{
    onBeforeAction:function(){
        var currentRoute=Router.current().route.getName();
        if (Meteor.userId())
        {
            Router.go('posts');
        }
        else
        {
            this.next();
        }
    }
})

Router.route('/posts/blank',{
    template:'blank',
    'name':'blank',
     onBeforeAction:function(){
        var currentUser=Meteor.userId();
        if (currentUser){
            this.next();
        }
        else{
            this.render('login');
        }
    }
});



Router.route('/users',{
    onBeforeAction:function(){
        var currentUser=Meteor.userId();
        if (currentUser){
            this.next();
        }
        else{
            this.render('login');
        }
    }
    });




Router.route('/createProfile', {
    template: 'createProfile',
    name:'createProfile',
    data: function(){
        
        return Profile.findOne({ currentUser: Meteor.userId() });

    },
     onBeforeAction:function(){
        var currentUser=Meteor.userId();
        if (currentUser){
            this.next();
        }
        else{
            this.render('login');
        }
    }
});

Router.route('/post/:_id', {
    template: 'commentPage',
    name:'commentPage',
    data: function(){
        var currentPost = this.params._id;
        return Posts.findOne({ _id: currentPost });
    },
    onBeforeAction:function(){
        var currentUser=Meteor.userId();
        if (currentUser){
            this.next();
        }
        else{
            this.render('login');
        }
    }
});

Router.route('/user/:_id', {
    template: 'profilePage',
    name:'profilePage',
    data: function(){
        var currentProfile = this.params._id;
        return Profile.findOne({ _id: currentProfile });
    },
     onBeforeAction:function(){
        var currentUser=Meteor.userId();
        if (currentUser){
            this.next();
        }
        else{
            this.render('login');
        }
    }
});

Router.route('/user/:_id/following', {
    template: 'following',
    name:'following',
    data: function(){
        var currentProfile=this.params._id;
        
        return Profile.findOne({_id:currentProfile});
    },
     onBeforeAction:function(){
        var currentUser=Meteor.userId();
        if (currentUser){
            this.next();
        }
        else{
            this.render('login');
        }
    }
});
Router.route('/user/:_id/followers', {
    template: 'followers',
    name:'followers',
    data: function(){
        var currentProfile=this.params._id;
        
        return Profile.findOne({_id:currentProfile});
    },
     onBeforeAction:function(){
        var currentUser=Meteor.userId();
        if (currentUser){
            this.next();
        }
        else{
            this.render('login');
        }
    }
});

Router.route('/posts/search/:somesearch/',{
    template:'searchresults',
    name:'searchresults',
     
   data: function(){
    var searchbox=this.params.somesearch;
    var search=new RegExp('\\b'+searchbox+'\\b','i');
    
    return Posts.find({ name: search }).fetch();

    

  },
   onBeforeAction:function(){
        var currentUser=Meteor.userId();
        if (currentUser){
            this.next();
        }
        else{
            this.render('login');
        }
    }


    
});







