export function runBasicAI(config){
  const issues = [];

  if(config.length < 50){
    issues.push({severity:'LOW',message:'Config too small',impact:'Incomplete setup',fix:'Review full configuration'});
  }

  if(!config.includes('dns')){
    issues.push({severity:'LOW',message:'No DNS configuration detected',impact:'Possible connectivity issues',fix:'Configure DNS settings'});
  }

  return issues;
}
