import { Log } from '../constants';
import { AStar } from '../ai/AStar';
import { Funnel } from '../ai/Funnel';
import { Geom2D } from '../math/Geom2D';

function PathFinder() {

    this.astar = new AStar();
    this.funnel = new Funnel();
    this.listFaces = [];
    this.listEdges = [];
    this._mesh = null;
    this.entity = null;

    Object.defineProperty(this, 'mesh', {

        get: function() { return this._mesh; },
        set: function(value) { this._mesh = value; this.astar.mesh = value; }

    });
    
};

PathFinder.prototype = {

    constructor: PathFinder,

    dispose: function () {

        this._mesh = null;
        this.astar.dispose();
        this.astar = null;
        this.funnel.dispose();
        this.funnel = null;
        this.listEdges = null;
        this.listFaces = null;
    },

    findPath: function( target, resultPath ) {

        //resultPath = [];
        resultPath.splice(0,resultPath.length);
        //DDLS.Debug.assertFalse(this._mesh == null,"Mesh missing",{ fileName : "PathFinder.hx", lineNumber : 51, className : "DDLS.PathFinder", methodName : "findPath"});
        //DDLS.Debug.assertFalse(this.entity == null,"Entity missing",{ fileName : "PathFinder.hx", lineNumber : 52, className : "DDLS.PathFinder", methodName : "findPath"});
        if( Geom2D.isCircleIntersectingAnyConstraint(target,this.entity.radius,this._mesh) ) return;
        this.astar.radius = this.entity.radius;
        this.funnel.radius = this.entity.radius;
        this.listFaces.splice(0,this.listFaces.length);
        this.listEdges.splice(0,this.listEdges.length);
        //this.listFaces = [];
        //this.listEdges = [];
        var start = this.entity.position;
        this.astar.findPath( start, target, this.listFaces, this.listEdges );
        if(this.listFaces.length == 0) {
            Log("PATH LENGTH = 0 (PathFinder)");
            //Log("PathFinder listFaces.length == 0");
            return;
        }
        this.funnel.findPath( start, target, this.listFaces, this.listEdges, resultPath );

    }
};

export { PathFinder };