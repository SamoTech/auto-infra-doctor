export function runMikroTikRules(config){
  const issues = [];

  if(config.includes('chain=input') && !config.includes('action=drop')){
    issues.push({ severity:'CRITICAL', message:'No drop rule in input chain', impact:'Router exposed', fix:'/ip firewall filter add chain=input action=drop' });
  }

  if(config.includes('8291') || config.includes('8728')){
    issues.push({ severity:'CRITICAL', message:'Management ports exposed', impact:'Security risk', fix:'Restrict via firewall' });
  }

  if(!config.includes('established,related')){
    issues.push({ severity:'HIGH', message:'Missing established rule', impact:'Traffic issues', fix:'/ip firewall filter add chain=input connection-state=established,related action=accept' });
  }

  if(config.includes('fasttrack') && !config.includes('established,related')){
    issues.push({ severity:'HIGH', message:'FastTrack misuse', impact:'Unstable firewall', fix:'Reorder rules' });
  }

  return issues;
}
