import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Time "mo:core/Time";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";

actor {
  type Idea = {
    id : Nat;
    title : Text;
    description : Text;
    category : Text;
    createdAt : Int;
    isFavorite : Bool;
  };

  let ideas = Map.empty<Nat, Idea>();
  var nextId = 0;

  public shared ({ caller }) func createIdea(title : Text, description : Text, category : Text) : async Idea {
    let id = nextId;
    nextId += 1;

    let newIdea : Idea = {
      id;
      title;
      description;
      category;
      createdAt = Time.now();
      isFavorite = false;
    };

    ideas.add(id, newIdea);
    newIdea;
  };

  public query ({ caller }) func getAllIdeas() : async [Idea] {
    let ideaArray = ideas.toArray();
    ideaArray.map(func((_, idea)) { idea });
  };

  public shared ({ caller }) func deleteIdea(id : Nat) : async () {
    if (not ideas.containsKey(id)) {
      Runtime.trap("Idea with id " # id.toText() # " does not exist");
    };
    ideas.remove(id);
  };

  public shared ({ caller }) func toggleFavorite(id : Nat) : async Idea {
    switch (ideas.get(id)) {
      case (null) { Runtime.trap("Idea with id " # id.toText() # " does not exist") };
      case (?idea) {
        let updatedIdea : Idea = {
          idea with isFavorite = not idea.isFavorite;
        };
        ideas.add(id, updatedIdea);
        updatedIdea;
      };
    };
  };
};
