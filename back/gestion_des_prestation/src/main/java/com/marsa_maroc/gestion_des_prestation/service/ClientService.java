package com.marsa_maroc.gestion_des_prestation.service;

import com.marsa_maroc.gestion_des_prestation.entities.Client;
import com.marsa_maroc.gestion_des_prestation.respositories.ClientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ClientService {
    private final ClientRepository clientRepository;

    public List<Client> getAllClients() {
        return clientRepository.findAll();
    }

    public Optional<Client> getClientById(Integer id) {
        return clientRepository.findById(id);
    }

    public Optional<Client> getClientByCode(String codeClient) {
        return clientRepository.findByCodeClient(codeClient);
    }

    public Client saveClient(Client client) {
        return clientRepository.save(client);
    }

    public void deleteClient(Integer id) {
        clientRepository.deleteById(id);
    }

    public boolean existsByCodeClient(String codeClient) {
        return clientRepository.existsByCodeClient(codeClient);
    }
}


