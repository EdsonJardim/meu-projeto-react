import {createClient} from "@supabase/supabase-js";

const supabaseUrl = "https://nmarrrxcqkbkfwuzqcwo.supabase.co";
const supabaseKey = sb_publishable_mwvXCJYaOckYYU8_U9KCZQ_RdK0n55w

export const supabase = createClient(supabaseUrl, supabaseKey);

async function imgUpload(file)
{
    const {data, error} = await supabase.storage.from("imagens").upload(`public/${file.name}`, file);

    if (error) {
        console.error("Erro ao fazer upload:", error);
        return null;
    }

    const {data} = supabase.storage.from("imagens").getPublicUrl(`public/${file.name}`);
    console.log(data.publicUrl);

    await supabase.from("imagens").insert([
        {
            nome: 'Produto A',
            imagem: url
        }
    ]);
}



