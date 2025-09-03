package com.email.assistant;

import com.google.genai.Client;
import com.google.genai.types.GenerateContentResponse;
import org.springframework.beans.factory.annotation.Value;

import org.springframework.stereotype.Service;


@Service
public class EmailGeneratorService {


    @Value("${gemini.api.key}")
    private String apiKey;
    public String GenerateEmailReply(EmailRequest emailRequest){

        try {

            String prompt = buildPrompt(emailRequest);
            Client client = Client.builder()
                    .apiKey(apiKey)
                    .build();

            GenerateContentResponse response =
                    client.models.generateContent(
                            "gemini-2.0-flash",
                            prompt,
                            null
                    );

            // Return first candidate if available
            if (response != null ) {
                return response.text();
            } else {
                return "No response from Gemini.";
            }

        } catch (Exception e) {
            return "Error generating email: " + e.getMessage();
        }


    }
    private String buildPrompt(EmailRequest emailRequest){
        StringBuilder prompt=new StringBuilder();
        prompt.append("Generate a professional email reply for the following content . please don't generate subject line as well give me only one email  reply don't add anything extra " );
        if(emailRequest.getTone() !=null && !emailRequest.getTone().isEmpty()){
            prompt.append("use a ").append(emailRequest.getTone()).append("tone");
        }
        prompt.append("\n original email : \n").append(emailRequest.getEmailContent());

        return prompt.toString();
    }
}
