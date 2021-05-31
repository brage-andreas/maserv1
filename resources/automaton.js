const twoCharLength = (num) => num<10 ? String("0"+num) : String(num);

/**
 * @returns sec, min, hour [ ]
 */
 const time = () => {
    const now = new Date;
    
    const sec = twoCharLength(now.getSeconds());
    const min = twoCharLength(now.getMinutes());
    const hour = twoCharLength(now.getHours());
    
    return [sec, min, hour];
}


const cache = {};
const chatLog = async (message) => { 
    const { green, yellow } = await getColours(message.client.user.id, true);
    const { guild, author, channel, attachments, embeds, edits, content } = message;
    const [ sec, min, hour ] = time();

    const attachs     = attachments?.map(attachment => attachment.url).join("; ");

    const embedAmount = embeds?.filter(embed => embed.type === "rich");
    const embs        = embedAmount.size ? `${embedAmount.size} embed(s)` : null;

    if ( attachs.length &&  embs) extras = `${attachs} -- ${embs}`; else
    if ( attachs.length && !embs) extras = attachs;                 else
    if (!attachs.length &&  embs) extras = embs;                    else
                                  extras = "";

    const strTime    = chalk `{grey ${hour}:${min}:${sec}}`;
    const strGuild   = chalk `{grey in "${guild.name}"}`;
    const strID      = chalk `{grey (${author.id})}`;
    const strAuthor  = chalk `{${green} ${author.tag}}`;
    const strChannel = chalk `{${yellow} #${channel.name}}`;

    const base = cache.lastUserID !== author.id || cache.lastChannelID !== channel.id
               ? `\n${strAuthor} ${strID} ${strChannel} ${strGuild}\n`
               : "";
    const edit = edits.length>1 ? chalk ` {${yellow} EDIT} ${edits[1]} {${yellow} =>}` : ""

    console.log(chalk `${base}${strTime} {grey >}${edit} ${content} {grey < ${extras}}`);

    cache.lastChannelID = channel.id;
    cache.lastUserID    = author .id;
}


const botLog = async (id, custom, guildName=null, channelName=null) => {
    const { red, yellow } = await getColours(id, true);
    const [ sec, min, hour ] = time();

    const strTime    = chalk `{grey ${hour}:${min}:${sec}}`;
    const strChannel = channelName ? chalk `{${yellow} #${channelName}} ` : "";
    const strGuild   = guildName   ? chalk `{grey in "${guildName}"} `        : "";

    console.log(chalk `\n{${red} ~/ CLIENT} ${strChannel}${strGuild}\n   ${strTime} ${custom}`);

    cache.lastChannelID = null;
    cache.lastUserID    = null;
}



export { time }