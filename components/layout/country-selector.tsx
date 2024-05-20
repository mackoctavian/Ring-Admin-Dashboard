"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select";

interface Props {
  value?: string;
  onChange: (value: string) => void;
}

export default function CountrySelector({ value, onChange }: Props) {
    return (
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select country" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>North America</SelectLabel>
              <SelectItem value="Antigua and Barbuda">Antigua and Barbuda</SelectItem>
              <SelectItem value="Bahamas">Bahamas</SelectItem>
              <SelectItem value="Barbados">Barbados</SelectItem>
              <SelectItem value="Belize">Belize</SelectItem>
              <SelectItem value="Canada">Canada</SelectItem>
              <SelectItem value="Costa Rica">Costa Rica</SelectItem>
              <SelectItem value="Cuba">Cuba</SelectItem>
              <SelectItem value="Dominica">Dominica</SelectItem>
              <SelectItem value="Dominican Republic">Dominican Republic</SelectItem>
              <SelectItem value="El Salvador">El Salvador</SelectItem>
              <SelectItem value="Grenada">Grenada</SelectItem>
              <SelectItem value="Guatemala">Guatemala</SelectItem>
              <SelectItem value="Haiti">Haiti</SelectItem>
              <SelectItem value="Honduras">Honduras</SelectItem>
              <SelectItem value="Jamaica">Jamaica</SelectItem>
              <SelectItem value="Mexico">Mexico</SelectItem>
              <SelectItem value="Nicaragua">Nicaragua</SelectItem>
              <SelectItem value="Panama">Panama</SelectItem>
              <SelectItem value="Saint Kitts and Nevis">Saint Kitts and Nevis</SelectItem>
              <SelectItem value="Saint Lucia">Saint Lucia</SelectItem>
              <SelectItem value="Saint Vincent and the Grenadines">Saint Vincent and the Grenadines</SelectItem>
              <SelectItem value="Trinidad and Tobago">Trinidad and Tobago</SelectItem>
              <SelectItem value="United States">United States</SelectItem>
            </SelectGroup>
            <SelectGroup>
              <SelectLabel>South America</SelectLabel>
              <SelectItem value="Argentina">Argentina</SelectItem>
              <SelectItem value="Bolivia">Bolivia</SelectItem>
              <SelectItem value="Brazil">Brazil</SelectItem>
              <SelectItem value="Chile">Chile</SelectItem>
              <SelectItem value="Colombia">Colombia</SelectItem>
              <SelectItem value="Ecuador">Ecuador</SelectItem>
              <SelectItem value="Guyana">Guyana</SelectItem>
              <SelectItem value="Paraguay">Paraguay</SelectItem>
              <SelectItem value="Peru">Peru</SelectItem>
              <SelectItem value="Suriname">Suriname</SelectItem>
              <SelectItem value="Uruguay">Uruguay</SelectItem>
              <SelectItem value="Venezuela">Venezuela</SelectItem>
            </SelectGroup>
            <SelectGroup>
              <SelectLabel>Europe</SelectLabel>
              <SelectItem value="Albania">Albania</SelectItem>
              <SelectItem value="Andorra">Andorra</SelectItem>
              <SelectItem value="Armenia">Armenia</SelectItem>
              <SelectItem value="Austria">Austria</SelectItem>
              <SelectItem value="Azerbaijan">Azerbaijan</SelectItem>
              <SelectItem value="Belarus">Belarus</SelectItem>
              <SelectItem value="Belgium">Belgium</SelectItem>
              <SelectItem value="Bosnia and Herzegovina">Bosnia and Herzegovina</SelectItem>
              <SelectItem value="Bulgaria">Bulgaria</SelectItem>
              <SelectItem value="Croatia">Croatia</SelectItem>
              <SelectItem value="Cyprus">Cyprus</SelectItem>
              <SelectItem value="Czech Republic">Czech Republic</SelectItem>
              <SelectItem value="Denmark">Denmark</SelectItem>
              <SelectItem value="Estonia">Estonia</SelectItem>
              <SelectItem value="Finland">Finland</SelectItem>
              <SelectItem value="France">France</SelectItem>
              <SelectItem value="Georgia">Georgia</SelectItem>
              <SelectItem value="Germany">Germany</SelectItem>
              <SelectItem value="Greece">Greece</SelectItem>
              <SelectItem value="Hungary">Hungary</SelectItem>
              <SelectItem value="Iceland">Iceland</SelectItem>
              <SelectItem value="Ireland">Ireland</SelectItem>
              <SelectItem value="Italy">Italy</SelectItem>
              <SelectItem value="Kazakhstan">Kazakhstan</SelectItem>
              <SelectItem value="Kosovo">Kosovo</SelectItem>
              <SelectItem value="Latvia">Latvia</SelectItem>
              <SelectItem value="Liechtenstein">Liechtenstein</SelectItem>
              <SelectItem value="Lithuania">Lithuania</SelectItem>
              <SelectItem value="Luxembourg">Luxembourg</SelectItem>
              <SelectItem value="Malta">Malta</SelectItem>
              <SelectItem value="Moldova">Moldova</SelectItem>
              <SelectItem value="Monaco">Monaco</SelectItem>
              <SelectItem value="Montenegro">Montenegro</SelectItem>
              <SelectItem value="Netherlands">Netherlands</SelectItem>
              <SelectItem value="North Macedonia">North Macedonia</SelectItem>
              <SelectItem value="Norway">Norway</SelectItem>
              <SelectItem value="Poland">Poland</SelectItem>
              <SelectItem value="Portugal">Portugal</SelectItem>
              <SelectItem value="Romania">Romania</SelectItem>
              <SelectItem value="Russia">Russia</SelectItem>
              <SelectItem value="San Marino">San Marino</SelectItem>
              <SelectItem value="Serbia">Serbia</SelectItem>
              <SelectItem value="Slovakia">Slovakia</SelectItem>
              <SelectItem value="Slovenia">Slovenia</SelectItem>
              <SelectItem value="Spain">Spain</SelectItem>
              <SelectItem value="Sweden">Sweden</SelectItem>
              <SelectItem value="Switzerland">Switzerland</SelectItem>
              <SelectItem value="Turkey">Turkey</SelectItem>
              <SelectItem value="Ukraine">Ukraine</SelectItem>
              <SelectItem value="United Kingdom">United Kingdom</SelectItem>
              <SelectItem value="Vatican City">Vatican City</SelectItem>
            </SelectGroup>
            <SelectGroup>
              <SelectLabel>Africa</SelectLabel>
              <SelectItem value="Algeria">Algeria</SelectItem>
              <SelectItem value="Angola">Angola</SelectItem>
              <SelectItem value="Benin">Benin</SelectItem>
              <SelectItem value="Botswana">Botswana</SelectItem>
              <SelectItem value="Burkina Faso">Burkina Faso</SelectItem>
              <SelectItem value="Burundi">Burundi</SelectItem>
              <SelectItem value="Cabo Verde">Cabo Verde</SelectItem>
              <SelectItem value="Cameroon">Cameroon</SelectItem>
              <SelectItem value="Central African Republic">Central African Republic</SelectItem>
              <SelectItem value="Chad">Chad</SelectItem>
              <SelectItem value="Comoros">Comoros</SelectItem>
              <SelectItem value="Congo, Democratic Republic of the">Congo, Democratic Republic of the</SelectItem>
              <SelectItem value="Congo, Republic of the">Congo, Republic of the</SelectItem>
              <SelectItem value="Djibouti">Djibouti</SelectItem>
              <SelectItem value="Egypt">Egypt</SelectItem>
              <SelectItem value="Equatorial Guinea">Equatorial Guinea</SelectItem>
              <SelectItem value="Eritrea">Eritrea</SelectItem>
              <SelectItem value="Eswatini">Eswatini</SelectItem>
              <SelectItem value="Ethiopia">Ethiopia</SelectItem>
              <SelectItem value="Gabon">Gabon</SelectItem>
              <SelectItem value="Gambia">Gambia</SelectItem>
              <SelectItem value="Ghana">Ghana</SelectItem>
              <SelectItem value="Guinea">Guinea</SelectItem>
              <SelectItem value="Guinea-Bissau">Guinea-Bissau</SelectItem>
              <SelectItem value="Ivory Coast">Ivory Coast</SelectItem>
              <SelectItem value="Kenya">Kenya</SelectItem>
              <SelectItem value="Lesotho">Lesotho</SelectItem>
              <SelectItem value="Liberia">Liberia</SelectItem>
              <SelectItem value="Libya">Libya</SelectItem>
              <SelectItem value="Madagascar">Madagascar</SelectItem>
              <SelectItem value="Malawi">Malawi</SelectItem>
              <SelectItem value="Mali">Mali</SelectItem>
              <SelectItem value="Mauritania">Mauritania</SelectItem>
              <SelectItem value="Mauritius">Mauritius</SelectItem>
              <SelectItem value="Morocco">Morocco</SelectItem>
              <SelectItem value="Mozambique">Mozambique</SelectItem>
              <SelectItem value="Namibia">Namibia</SelectItem>
              <SelectItem value="Niger">Niger</SelectItem>
              <SelectItem value="Nigeria">Nigeria</SelectItem>
              <SelectItem value="Rwanda">Rwanda</SelectItem>
              <SelectItem value="Sao Tome and Principe">Sao Tome and Principe</SelectItem>
              <SelectItem value="Senegal">Senegal</SelectItem>
              <SelectItem value="Seychelles">Seychelles</SelectItem>
              <SelectItem value="Sierra Leone">Sierra Leone</SelectItem>
              <SelectItem value="Somalia">Somalia</SelectItem>
              <SelectItem value="South Africa">South Africa</SelectItem>
              <SelectItem value="South Sudan">South Sudan</SelectItem>
              <SelectItem value="Sudan">Sudan</SelectItem>
              <SelectItem value="Tanzania">Tanzania</SelectItem>
              <SelectItem value="Togo">Togo</SelectItem>
              <SelectItem value="Tunisia">Tunisia</SelectItem>
              <SelectItem value="Uganda">Uganda</SelectItem>
              <SelectItem value="Zambia">Zambia</SelectItem>
              <SelectItem value="Zimbabwe">Zimbabwe</SelectItem>
            </SelectGroup>
            <SelectGroup>
              <SelectLabel>Asia</SelectLabel>
              <SelectItem value="Afghanistan">Afghanistan</SelectItem>
              <SelectItem value="Armenia">Armenia</SelectItem>
              <SelectItem value="Azerbaijan">Azerbaijan</SelectItem>
              <SelectItem value="Bahrain">Bahrain</SelectItem>
              <SelectItem value="Bangladesh">Bangladesh</SelectItem>
              <SelectItem value="Bhutan">Bhutan</SelectItem>
              <SelectItem value="Brunei">Brunei</SelectItem>
              <SelectItem value="Cambodia">Cambodia</SelectItem>
              <SelectItem value="China">China</SelectItem>
              <SelectItem value="Cyprus">Cyprus</SelectItem>
              <SelectItem value="Georgia">Georgia</SelectItem>
              <SelectItem value="India">India</SelectItem>
              <SelectItem value="Indonesia">Indonesia</SelectItem>
              <SelectItem value="Iran">Iran</SelectItem>
              <SelectItem value="Iraq">Iraq</SelectItem>
              <SelectItem value="Israel">Israel</SelectItem>
              <SelectItem value="Japan">Japan</SelectItem>
              <SelectItem value="Jordan">Jordan</SelectItem>
              <SelectItem value="Kazakhstan">Kazakhstan</SelectItem>
              <SelectItem value="Kuwait">Kuwait</SelectItem>
              <SelectItem value="Kyrgyzstan">Kyrgyzstan</SelectItem>
              <SelectItem value="Laos">Laos</SelectItem>
              <SelectItem value="Lebanon">Lebanon</SelectItem>
              <SelectItem value="Malaysia">Malaysia</SelectItem>
              <SelectItem value="Maldives">Maldives</SelectItem>
              <SelectItem value="Mongolia">Mongolia</SelectItem>
              <SelectItem value="Myanmar">Myanmar</SelectItem>
              <SelectItem value="Nepal">Nepal</SelectItem>
              <SelectItem value="North Korea">North Korea</SelectItem>
              <SelectItem value="Oman">Oman</SelectItem>
              <SelectItem value="Pakistan">Pakistan</SelectItem>
              <SelectItem value="Palestine">Palestine</SelectItem>
              <SelectItem value="Philippines">Philippines</SelectItem>
              <SelectItem value="Qatar">Qatar</SelectItem>
              <SelectItem value="Saudi Arabia">Saudi Arabia</SelectItem>
              <SelectItem value="Singapore">Singapore</SelectItem>
              <SelectItem value="South Korea">South Korea</SelectItem>
              <SelectItem value="Sri Lanka">Sri Lanka</SelectItem>
              <SelectItem value="Syria">Syria</SelectItem>
              <SelectItem value="Tajikistan">Tajikistan</SelectItem>
              <SelectItem value="Thailand">Thailand</SelectItem>
              <SelectItem value="Timor-Leste">Timor-Leste</SelectItem>
              <SelectItem value="Turkey">Turkey</SelectItem>
              <SelectItem value="Turkmenistan">Turkmenistan</SelectItem>
              <SelectItem value="United Arab Emirates">United Arab Emirates</SelectItem>
              <SelectItem value="Uzbekistan">Uzbekistan</SelectItem>
              <SelectItem value="Vietnam">Vietnam</SelectItem>
              <SelectItem value="Yemen">Yemen</SelectItem>
            </SelectGroup>
            <SelectGroup>
              <SelectLabel>Oceania</SelectLabel>
              <SelectItem value="Australia">Australia</SelectItem>
              <SelectItem value="Fiji">Fiji</SelectItem>
              <SelectItem value="Kiribati">Kiribati</SelectItem>
              <SelectItem value="Marshall Islands">Marshall Islands</SelectItem>
              <SelectItem value="Micronesia">Micronesia</SelectItem>
              <SelectItem value="Nauru">Nauru</SelectItem>
              <SelectItem value="New Zealand">New Zealand</SelectItem>
              <SelectItem value="Palau">Palau</SelectItem>
              <SelectItem value="Papua New Guinea">Papua New Guinea</SelectItem>
              <SelectItem value="Samoa">Samoa</SelectItem>
              <SelectItem value="Solomon Islands">Solomon Islands</SelectItem>
              <SelectItem value="Tonga">Tonga</SelectItem>
              <SelectItem value="Tuvalu">Tuvalu</SelectItem>
              <SelectItem value="Vanuatu">Vanuatu</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      );
      
}