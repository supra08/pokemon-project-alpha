import smartpy as sp

class MyContract(sp.Contract):
    def __init__(self):
        self.init(ownersToPokemons = {'razor': {'pikachu', 'bulbasaur'}})

    @sp.entry_point
    def addPokemon(self, params):
        self.checkPlayer(params.name)
        self.data.ownersToPokemons[params.name].add(params.pokemon)
        
    def checkPlayer(self, name):
        sp.if ~(self.data.ownersToPokemons.contains(name)):
            self.data.ownersToPokemons[name] = sp.set()
        
    @sp.entry_point
    def releasePokemon(self, params):
        sp.if (self.data.ownersToPokemons.contains(params.name)):
            self.data.ownersToPokemons[params.name].remove(params.pokemon)
            
    @sp.entry_point
    def transferPokemon(self, params):
        sp.if (self.data.ownersToPokemons.contains(params.senderName) & self.data.ownersToPokemons.contains(params.receiverName)):
            self.data.ownersToPokemons[params.senderName].remove(params.pokemon)
            self.data.ownersToPokemons[params.receiverName].add(params.pokemon)

@sp.add_test(name = "AdvancedTest")
def test():
    scenario = sp.test_scenario()
    scenario.h1("Pokemon Registry")
    c1 = MyContract()
    scenario += c1
    
    scenario.h2('Add pokemon to players list')
    scenario += c1.addPokemon(pokemon = "pikachu", name = "supradeux")
    scenario += c1.addPokemon(pokemon = "charizard", name = "supradeux")
    scenario +=c1.releasePokemon(pokemon = "charizard", name="supradeux")
    scenario += c1.addPokemon(pokemon = "bulbasaur", name = "tony")
    
    scenario.h3('Transfer pokemon to other players')
    scenario += c1.transferPokemon(senderName='tony', receiverName='supradeux', pokemon='bulbasaur')
    

    
    
    