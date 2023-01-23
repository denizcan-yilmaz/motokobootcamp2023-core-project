import Iter "mo:base/Iter";
import Result "mo:base/Result";
import Buffer "mo:base/Buffer";
import Time "mo:base/Time";
import Text "mo:base/Text";
import Nat "mo:base/Nat";
import Int "mo:base/Int";
import HashMap "mo:base/HashMap";
import Principal "mo:base/Principal";
import Array "mo:base/Array";
import Option "mo:base/Option";

actor {
    private stable var proposalCount : Nat = 0;
    stable let requiredPower = 100000000;
    stable let thresholdPower = 10000000000;

    public type Proposal = {
        ownerOfProposal : Text;
        proposalId : Text;
        webPageText : Text;
        acceptedCount : Nat;
        rejectedCount : Nat;
        creationDate : Text;
        resultDate : Text;
        votersArray : [Text];
        isActive : Bool
    };
    public type ICRC1_Type = { owner : Principal; subaccount : ?[Nat8] };

    let TokenCanister = actor ("rrkah-fqaaa-aaaaa-aaaaq-cai") : actor {
        icrc1_balance_of : (account : ICRC1_Type) -> async Nat
    };
    let WebpageControlCanister = actor ("renrk-eyaaa-aaaaa-aaada-cai") : actor {
        setWebpageText : (text : Text) -> async ()
    };

    stable var proposalArray : [(Text, Proposal)] = [];

    var proposals = HashMap.fromIter<Text, Proposal>(proposalArray.vals(), 100000, Text.equal, Text.hash);

    // Helpers

    public shared func heartbeatProposalCheck() : async () {

        var buffer = Buffer.Buffer<Proposal>(0);
        for (proposal in proposals.vals()) {
            buffer.add(proposal)
        };
        for (proposal in buffer.vals()) {
            if (proposal.isActive and proposal.acceptedCount >= thresholdPower) {
                let currentTime = Int.toText(Time.now());
                let tempProposal : Proposal = {
                    ownerOfProposal = proposal.ownerOfProposal;
                    proposalId = proposal.proposalId;
                    webPageText = proposal.webPageText;
                    acceptedCount = proposal.acceptedCount;
                    rejectedCount = proposal.rejectedCount;
                    creationDate = proposal.creationDate;
                    resultDate = currentTime;
                    votersArray = proposal.votersArray;
                    isActive = false
                };
                proposals.put(proposal.proposalId, tempProposal);
                await WebpageControlCanister.setWebpageText(proposal.webPageText);
                return
            } else if (proposal.isActive and proposal.rejectedCount >= thresholdPower) {
                let currentTime = Int.toText(Time.now());
                let tempProposal : Proposal = {
                    ownerOfProposal = proposal.ownerOfProposal;
                    proposalId = proposal.proposalId;
                    webPageText = proposal.webPageText;
                    acceptedCount = proposal.acceptedCount;
                    rejectedCount = proposal.rejectedCount;
                    creationDate = proposal.creationDate;
                    resultDate = currentTime;
                    votersArray = proposal.votersArray;
                    isActive = false
                };
                proposals.put(proposal.proposalId, tempProposal);
                return
            }
        }

    };

    private func canVote(votersArray : [Text], principal : Text) : Bool {
        for (iter in votersArray.vals()) {
            if (Text.equal(principal, iter)) {
                return false
            }
        };
        return true
    };

    private func votePower(principal : Principal) : async Nat {
        return await TokenCanister.icrc1_balance_of({
            owner = principal;
            subaccount = null
        })
    };
    public shared query func get_proposal(proposalId : Text) : async Result.Result<Proposal, Text> {
        switch (proposals.get(proposalId)) {
            case (null) {
                return #err("There is no such proposal")
            };
            case (?proposal) {
                return #ok(proposal)
            }
        }
    };

    public shared ({ caller }) func submit_proposal(text : Text) : async Result.Result<Proposal, Text> {
        if (Nat.equal(text.size(), 0)) {
            return #err("You cannot propose empty text")
        };
        let userPower = await votePower(caller);
        let tempProposal : Proposal = {
            ownerOfProposal = Principal.toText(caller);
            proposalId = Nat.toText(proposalCount);
            webPageText = text;
            acceptedCount = userPower;
            rejectedCount = 0;
            creationDate = Int.toText(Time.now());
            resultDate = Int.toText(Time.now());
            votersArray = [Principal.toText(caller)];
            isActive = true
        };
        proposals.put(Nat.toText(proposalCount), tempProposal);
        proposalCount := proposalCount +1;
        return #ok(tempProposal)
    };

    public shared query func get_all_proposals() : async [Proposal] {
        var buffer = Buffer.Buffer<Proposal>(0);
        for (proposal in proposals.vals()) {
            buffer.add(proposal)
        };
        return buffer.toArray()
    };

    public shared ({ caller }) func vote(proposalId : Text, isAccepted : Bool) : async Result.Result<Proposal, Text> {
        let power = await votePower(caller);
        if (power < requiredPower) {
            return #err("Not enough DAO token")
        };
        switch (proposals.get(proposalId)) {
            case (?proposal) {
                if (not proposal.isActive) {
                    return #err("Proposal not active")
                };
                if (not canVote(proposal.votersArray, Principal.toText(caller))) {
                    return #err("Already voted")
                };
                if (isAccepted) {
                    let newVoterArray = Array.append(proposal.votersArray, [Principal.toText(caller)]);
                    let tempProposal : Proposal = {
                        ownerOfProposal = proposal.ownerOfProposal;
                        proposalId = proposal.proposalId;
                        webPageText = proposal.webPageText;
                        acceptedCount = proposal.acceptedCount + power;
                        rejectedCount = proposal.rejectedCount;
                        creationDate = proposal.creationDate;
                        resultDate = proposal.resultDate;
                        votersArray = newVoterArray;
                        isActive = true
                    };
                    proposals.put(proposalId, tempProposal)
                } else {
                    let newVoterArray = Array.append(proposal.votersArray, [Principal.toText(caller)]);
                    let tempProposal : Proposal = {
                        ownerOfProposal = proposal.ownerOfProposal;
                        proposalId = proposal.proposalId;
                        webPageText = proposal.webPageText;
                        acceptedCount = proposal.acceptedCount;
                        rejectedCount = proposal.rejectedCount + power;
                        creationDate = proposal.creationDate;
                        resultDate = proposal.resultDate;
                        votersArray = newVoterArray;
                        isActive = true
                    };
                    proposals.put(proposalId, tempProposal)
                };
                return #ok(proposal)
            };
            case (_) {
                return #err("There is no such proposal")

            }
        }
    };

    system func preupgrade() {
        proposalArray := Iter.toArray(proposals.entries())
    };

    system func postupgrade() {
        proposalArray := []
    };
    system func heartbeat() : async () {
        await heartbeatProposalCheck()
    }

}